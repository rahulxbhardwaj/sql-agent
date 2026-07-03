import { TraceStep } from "./api";

export interface Message {

    id: string;

    role: "user" | "assistant";

    content: string;

    sql?: string;

    reasoning?: string;

    answer?: Record<string, any>[];

    trace?: TraceStep[];

    error?: string;

}