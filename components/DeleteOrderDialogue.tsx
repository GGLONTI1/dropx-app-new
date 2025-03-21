import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteOrderById } from "@/lib/query/queries";
import { toast } from "sonner";

export function DeleteOrderDialogue({
  open,
  setOpen,
  orderId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderId: string;
}) {
  const { mutate: deleteOrder } = useDeleteOrderById();

  console.log(orderId);

  const handleDeleteOrder = () => {
    deleteOrder(orderId, {
      onSuccess: () => {
        setOpen(false);
        toast.success("Order deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete order");
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            order from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteOrder}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
