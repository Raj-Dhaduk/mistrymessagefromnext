import "next-auth";
import { DefaultSession } from "next-auth";
import { Session } from "../../node_modules/next-auth/core/types.d";
import { module } from '../../node_modules/@webassemblyjs/ast/esm/nodes';

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module 'next-auth/jwt'{
    interface JWT {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    }
  
}