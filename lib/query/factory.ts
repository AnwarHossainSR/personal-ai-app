import { useQuery, useQueryClient, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface QueryDescriptor<TData = any, TVariables = any> {
  key: (variables?: TVariables) => string[]
  fetcher: (variables?: TVariables) => Promise<TData>
}

export interface MutationDescriptor<TData = any, TVariables = any> {
  mutationFn: (variables: TVariables) => Promise<TData>
  invalidateKeys?: string[][]
  optimisticUpdate?: {
    queryKey: string[]
    updater: (oldData: any, variables: TVariables) => any
  }
}

export function createListQuery<TData = any, TVariables = any>(
  endpoint: string,
  baseKey: string[],
): QueryDescriptor<TData, TVariables> {
  return {
    key: (variables) => [...baseKey, "list", variables].filter(Boolean),
    fetcher: (variables) =>
      apiClient.get(endpoint, {
        body: variables ? JSON.stringify(variables) : undefined,
      }),
  }
}

export function createDetailQuery<TData = any>(endpoint: string, baseKey: string[]): QueryDescriptor<TData, string> {
  return {
    key: (id) => [...baseKey, "detail", id].filter(Boolean),
    fetcher: (id) => apiClient.get(`${endpoint}/${id}`),
  }
}

export function createMutation<TData = any, TVariables = any>(
  descriptor: MutationDescriptor<TData, TVariables>,
): UseMutationOptions<TData, Error, TVariables> {
  const queryClient = useQueryClient()

  return {
    mutationFn: descriptor.mutationFn,
    onMutate: async (variables) => {
      if (descriptor.optimisticUpdate) {
        await queryClient.cancelQueries({ queryKey: descriptor.optimisticUpdate.queryKey })

        const previousData = queryClient.getQueryData(descriptor.optimisticUpdate.queryKey)

        queryClient.setQueryData(
          descriptor.optimisticUpdate.queryKey,
          descriptor.optimisticUpdate.updater(previousData, variables),
        )

        return { previousData }
      }
    },
    onError: (err, variables, context) => {
      if (descriptor.optimisticUpdate && context?.previousData) {
        queryClient.setQueryData(descriptor.optimisticUpdate.queryKey, context.previousData)
      }
    },
    onSettled: () => {
      if (descriptor.invalidateKeys) {
        descriptor.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key })
        })
      }
    },
  }
}

export function useListQuery<TData = any, TVariables = any>(
  descriptor: QueryDescriptor<TData, TVariables>,
  variables?: TVariables,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: descriptor.key(variables),
    queryFn: () => descriptor.fetcher(variables),
    ...options,
  })
}

export function useDetailQuery<TData = any>(
  descriptor: QueryDescriptor<TData, string>,
  id: string,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: descriptor.key(id),
    queryFn: () => descriptor.fetcher(id),
    enabled: !!id,
    ...options,
  })
}
