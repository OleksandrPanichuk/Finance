import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { hono } from "@/lib";

type ResponseType = InferResponseType<typeof hono.api.transactions.$post>;
type RequestType = InferRequestType<
  typeof hono.api.transactions.$post
>["json"];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await hono.api.transactions.$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction created.");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to create transaction.");
    },
  });

  return mutation;
};