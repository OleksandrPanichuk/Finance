import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { hono } from "@/lib/hono";

type ResponseType = InferResponseType<typeof hono.api.categories.$post>;
type RequestType = InferRequestType<typeof hono.api.categories.$post>["json"];

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await hono.api.categories.$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category created.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to create category.");
    },
  });

  return mutation;
};