export interface TraceStep {

    name: string;

    status: string;

    start_time: number;

    duration: number;

}

export interface ApiResponse {

    question: string;

    answer: Record<string, any>[];

    sql: string;

    reasoning: string;

    error: string;

    trace: TraceStep[];

}