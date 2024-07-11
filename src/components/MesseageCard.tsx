"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {

  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

import { Message } from '@/model/User';
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponce } from "@/types/Apiresponce";



type MesseageCardProps = {
  message: Message,
  onMessageDelete: (messageId:string)=>void
}

const MesseageCard = ({message, onMessageDelete}:MesseageCardProps) => {

  const {toast}= useToast()
  const handleDeleteConfirm = async () => {
  const responce= await axios.delete<ApiResponce>(`/api/delete-message/${message._id}`)
  toast({
    title:responce.data.message

  })
  onMessageDelete(message._id as string)
  
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"><X className='w-5,h-5'/></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default MesseageCard;
