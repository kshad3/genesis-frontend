import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getUnixTime } from "date-fns";
import { v4 as uuid } from "uuid";

type Payload = {
  role: "assistant" | "user";
  content: string;
};
export type Topic = {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
  typingRole?: "assistant" | "user";
  tags?: string[];
};

export type MessageFile = {
  name: string;
  type: string;
  content: string;
};

type SOURCE = {
  file_name: string;
  content: string;

}
export type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  createdAt: number;
  files?: MessageFile[];
  source_documents?: SOURCE[]
};

interface MessageStore {
  selectedModel: string;
  onModelChange: (model: string) => void;
  activeTopicId: string | null;
  topics: Topic[];
  updateTopic: (topicId: string, topic: Partial<Topic>) => void;
  addTopic: (newTopic: Topic) => void;
  deleteTopic: (topicId: string) => void;
  addMessage: (topicId: string, newMessage: Message) => Promise<void>;
}

const defaultTopic: Topic = {
  id: "1",
  name: "New Conversation",
  messages: [
    {
      id: "1",
      role: "assistant",
      content: "Hello! How can I help you today?",
      createdAt: getUnixTime(new Date()),
    },
  ],
  createdAt: getUnixTime(new Date()),
};
const useMessageStore = create(
  persist<MessageStore>(
    (set, get) => ({
      selectedModel: "gpt-4",
      onModelChange: (model) => {
        set({ selectedModel: model });
      },
      activeTopicId: null,
      topics: [defaultTopic],
      addTopic: (newTopic) =>
        set((state) => ({
          topics: [...state.topics, newTopic],
        })),
      updateTopic: (topicId, topic) => {
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId ? { ...t, ...topic } : t,
          ),
        }));
      },
      deleteTopic: (topicId) => {
        set((state) => ({
          topics: state.topics.filter((topic) => topic.id !== topicId),
        }));
      },
      addMessage: async (topicId, newMessage) => {
        const topic = get().topics.find((topic) => topic.id === topicId);
        const model = get().selectedModel;
        let messages = topic?.messages || [];
        messages = [...messages, newMessage];
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  messages,
                  typingRole: "assistant",
                }
              : topic,
          ),
        }));
        // call network to send message
        try {
          let payload: Payload[] = [];
          for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message.files && message.files.length > 0) {
              for (let j = 0; j < message.files.length; j++) {
                const file = message.files[j];
                payload.push({
                  role: message.role,
                  content: `Please consider following contents in prepareing your response:
                ${file.content}`,
                });
              }
            }
            if (message.content) {
              payload.push({ role: message.role, content: message.content });
            }
          }
          const tags = topic?.tags
            ? topic.tags.map((tag) => ({ id: tag }))
            : [];
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_MESSAGE_API_URL}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify({
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                model,
                messages: payload,
                tags,
              }),
            },
          ).then((res) => res.json());
          // append response to topic
          const responseMessage: Message = {
            id: uuid(),
            role: "assistant",
            content: res.text,
            source_documents: res.source_documents,
            createdAt: getUnixTime(new Date()),
          };
          set((state) => ({
            topics: state.topics.map((topic) =>
              topic.id === topicId
                ? {
                    ...topic,
                    messages: [...topic.messages, responseMessage],
                    typingRole: undefined,
                  }
                : topic,
            ),
          }));
        } catch (err) {
          console.log(err);
          // remove typing indicator
          set((state) => ({
            topics: state.topics.map((topic) =>
              topic.id === topicId
                ? {
                    ...topic,
                    typingRole: undefined,
                  }
                : topic,
            ),
          }));
        }
      },
    }),
    {
      name: "message-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        if (!state.topics || state.topics.length === 0) {
          state.addTopic(defaultTopic);
        }
      },
    },
  ),
);

export default useMessageStore;
