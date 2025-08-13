import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";

export type ContentItem = {
  _id: string;
  title: string;
  link: string;
  description: string;
  type: "youtube" | "twitter" | "document" | "website" | "image" | "music";
  tags: string[];
  userId?: { username: string };
};

type AddContentResponse = {
  message: string;
};

type AddContentInput = {
  title: string;
  link: string;
  description: string;
  type: "youtube" | "twitter" | "document" | "website" | "image" | "music";
};

type GetContentResponse = { content: ContentItem[] };

export function useContent() {
  const queryClient = useQueryClient();

  // get all content
  const getContentQuery = useQuery<GetContentResponse, Error>({
    queryKey: ["content", "list"],
    queryFn: async () => {
      const res = await api.get<GetContentResponse>("/content/get");
      return res.data;
    },
  });

  // add content
  const addContent = useMutation<AddContentResponse, Error, AddContentInput>({
    mutationKey: ["content", "add"],
    mutationFn: async (input: AddContentInput) => {
      const res = await api.post("/content/post", input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["content", "list"],
      });
    },
  });

  return {
    // data
    content: getContentQuery.data?.content ?? [],
    // status
    isLoading: getContentQuery.isLoading,
    error: getContentQuery.error,
    // actions
    refetch: getContentQuery.refetch,
    addContent,
  };
}
