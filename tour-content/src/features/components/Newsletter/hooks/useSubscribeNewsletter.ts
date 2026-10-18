import { useMutation } from "@tanstack/react-query";
import { subscribeToNewsletter, SubscribePayload } from "../api/newsletter.service";

export const useSubscribeNewsletter = () => {
    return useMutation({
        mutationFn: (payload: SubscribePayload) => subscribeToNewsletter(payload)
    })
}