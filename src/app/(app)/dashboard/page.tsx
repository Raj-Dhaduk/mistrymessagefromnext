"use client";

import { useToast } from "@/components/ui/use-toast";
import { Message, User } from "@/model/User";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponce } from "@/types/Apiresponce";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MesseageCard from "@/components/MesseageCard";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handelDelateMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessage = watch("acceptMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const responce = await axios.get<ApiResponce>("/api/AcceptMessage");
      setValue("acceptMessage", responce.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "faield to featch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const featchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(false);
      try {
        const responce = await axios.get<ApiResponce>("/api/getMessages");

        setMessages(responce.data.messages || []);
        if (refresh) {
          toast({
            title: "refreshed Messages",
            description: "showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponce>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "faield to featch messages",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setLoading(false);
      }
    },
    [setLoading, setMessages]
  );
  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    featchMessages(); // refresh messages when user logged in
  }, [session, setValue, featchMessages, fetchAcceptMessage]);

  const handelSwitchChange = async () => {
    try {
      const responce = await axios.post<ApiResponce>("/api/AcceptMessage", {
        acceptMessage: !acceptMessage,
      });

      setValue("acceptMessage", !acceptMessage);
      toast({
        title: responce.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "faield to featch messages",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessage}
          onCheckedChange={handelSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          featchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MesseageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handelDelateMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default page;
