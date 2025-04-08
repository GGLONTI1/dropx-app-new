import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  getCouriers,
  getUser,
  SignIn,
  SignOut,
  SignUp,
  updateProfile,
  getOrdersById,
  getOrderById,
  deleteOrderById,
  getOrdersByCourierId,
} from "../appwrite/auth";
import { ProfileFormValues, userDataType } from "@/typings";
import { OrderData } from "@/components/forms/OrderForm";
import { toast } from "sonner";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["useGetUser"],
    queryFn: getUser,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      SignIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetUser"] });
    },
  });
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: () => SignOut(),
  });
};
export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: userDataType) => SignUp(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetUser"] });
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData: OrderData) => createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useCreateOrder"] });
    },
  });
};

export const useGetCouriers = () => {
  return useQuery({
    queryKey: ["useGetCouriers"],
    queryFn: getCouriers,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });
};

export const useGetOrdersById = (userId: string) => {
  return useQuery({
    queryKey: ["getOrders", userId],
    queryFn: () => getOrdersById(userId),
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: ProfileFormValues) => updateProfile(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetUser"] });
    },
  });
};

export const useDeleteOrderById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => deleteOrderById(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOrders"] });
    },
    onError: () => {},
  });
};

export const useViewOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  return {
    fetchOrderDetails: (orderId: string) =>
      queryClient.fetchQuery({
        queryKey: ["orderDetails", orderId],
        queryFn: () => useViewOrder(orderId),
      }),
  };
};

export const useGetOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ["getOrderById", orderId],
    queryFn: () => getOrderById(orderId),
  });
};

export const useGetOrdersByCourierId = (courierId: string) => {
  return useQuery({
    queryKey: ["getOrdersByCourierId", courierId],
    queryFn: () => getOrdersByCourierId(courierId),
  });
};
