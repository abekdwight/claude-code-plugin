#!/usr/bin/env bun
/**
 * Backlog API Client
 *
 * Usage:
 *   bun run backlog.ts <command> [args...]
 *
 * Commands:
 *   get-space                          Get space info
 *   get-myself                         Get authenticated user
 *   get-users                          List users
 *   get-priorities                     List priorities
 *   get-projects                       List projects
 *   get-project <projectIdOrKey>       Get project details
 *   get-issue-types <projectIdOrKey>   List issue types
 *   get-issues [options]               Search issues
 *   get-issue <issueIdOrKey>           Get issue details
 *   create-issue <json>                Create issue
 *   update-issue <issueIdOrKey> <json> Update issue
 *   add-comment <issueIdOrKey> <content> Add comment
 *   get-notifications                  Get notifications
 *
 * Environment:
 *   BACKLOG_DOMAIN  - Backlog space domain (e.g., mycompany.backlog.com)
 *   BACKLOG_API_KEY - Backlog API key
 */

interface BacklogConfig {
  domain: string;
  apiKey: string;
}

interface Issue {
  id: number;
  issueKey: string;
  summary: string;
  description?: string;
  status: { id: number; name: string };
  priority: { id: number; name: string };
  assignee?: { id: number; name: string };
  createdUser: { id: number; name: string };
  created: string;
  updated: string;
}

interface Project {
  id: number;
  projectKey: string;
  name: string;
}

interface User {
  id: number;
  userId: string;
  name: string;
  roleType: number;
  mailAddress?: string;
}

function getConfig(): BacklogConfig {
  const domain = process.env.BACKLOG_DOMAIN;
  const apiKey = process.env.BACKLOG_API_KEY;

  if (!domain) {
    throw new Error("BACKLOG_DOMAIN environment variable is required");
  }
  if (!apiKey) {
    throw new Error("BACKLOG_API_KEY environment variable is required");
  }

  return { domain, apiKey };
}

async function callApi<T>(
  config: BacklogConfig,
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown>
): Promise<T> {
  const url = new URL(`https://${config.domain}/api/v2/${endpoint}`);
  url.searchParams.set("apiKey", config.apiKey);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), options);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Network error: Unable to connect to ${config.domain}. Check your internet connection and domain.`);
    }
    throw error;
  }

  if (!response.ok) {
    const errorText = await response.text();
    const statusMessages: Record<number, string> = {
      400: "Bad Request - Check your parameters",
      401: "Unauthorized - Check your API key",
      403: "Forbidden - You don't have permission",
      404: "Not Found - Resource doesn't exist or you don't have access",
      429: "Rate Limited - Too many requests, please wait",
      500: "Internal Server Error - Backlog server issue",
    };
    const hint = statusMessages[response.status] || "";
    throw new Error(`API Error ${response.status}${hint ? ` (${hint})` : ""}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

// Commands
async function getSpace(config: BacklogConfig) {
  return callApi(config, "space");
}

async function getMyself(config: BacklogConfig) {
  return callApi<User>(config, "users/myself");
}

async function getUsers(config: BacklogConfig) {
  return callApi<User[]>(config, "users");
}

async function getPriorities(config: BacklogConfig) {
  return callApi(config, "priorities");
}

async function getProjects(config: BacklogConfig, archived?: boolean) {
  let endpoint = "projects";
  if (archived !== undefined) {
    endpoint += `?archived=${archived}`;
  }
  return callApi<Project[]>(config, endpoint);
}

async function getProject(config: BacklogConfig, projectIdOrKey: string) {
  return callApi<Project>(config, `projects/${projectIdOrKey}`);
}

async function getIssueTypes(config: BacklogConfig, projectIdOrKey: string) {
  return callApi(config, `projects/${projectIdOrKey}/issueTypes`);
}

async function getCategories(config: BacklogConfig, projectIdOrKey: string) {
  return callApi(config, `projects/${projectIdOrKey}/categories`);
}

interface GetIssuesOptions {
  projectId?: number[];
  issueTypeId?: number[];
  statusId?: number[];
  priorityId?: number[];
  assigneeId?: number[];
  keyword?: string;
  count?: number;
  offset?: number;
  sort?: string;
  order?: "asc" | "desc";
}

async function getIssues(config: BacklogConfig, options: GetIssuesOptions = {}) {
  const params = new URLSearchParams();

  if (options.projectId) {
    options.projectId.forEach(id => params.append("projectId[]", id.toString()));
  }
  if (options.issueTypeId) {
    options.issueTypeId.forEach(id => params.append("issueTypeId[]", id.toString()));
  }
  if (options.statusId) {
    options.statusId.forEach(id => params.append("statusId[]", id.toString()));
  }
  if (options.priorityId) {
    options.priorityId.forEach(id => params.append("priorityId[]", id.toString()));
  }
  if (options.assigneeId) {
    options.assigneeId.forEach(id => params.append("assigneeId[]", id.toString()));
  }
  if (options.keyword) params.set("keyword", options.keyword);
  if (options.count) params.set("count", options.count.toString());
  if (options.offset) params.set("offset", options.offset.toString());
  if (options.sort) params.set("sort", options.sort);
  if (options.order) params.set("order", options.order);

  const queryString = params.toString();
  const endpoint = queryString ? `issues?${queryString}` : "issues";

  return callApi<Issue[]>(config, endpoint);
}

async function getIssue(config: BacklogConfig, issueIdOrKey: string) {
  return callApi<Issue>(config, `issues/${issueIdOrKey}`);
}

interface CreateIssueParams {
  projectId: number;
  summary: string;
  issueTypeId: number;
  priorityId: number;
  description?: string;
  assigneeId?: number;
  dueDate?: string;
  startDate?: string;
}

async function createIssue(config: BacklogConfig, params: CreateIssueParams) {
  // Backlog API requires form-urlencoded for POST
  const url = new URL(`https://${config.domain}/api/v2/issues`);
  url.searchParams.set("apiKey", config.apiKey);

  const formData = new URLSearchParams();
  formData.set("projectId", params.projectId.toString());
  formData.set("summary", params.summary);
  formData.set("issueTypeId", params.issueTypeId.toString());
  formData.set("priorityId", params.priorityId.toString());
  if (params.description) formData.set("description", params.description);
  if (params.assigneeId) formData.set("assigneeId", params.assigneeId.toString());
  if (params.dueDate) formData.set("dueDate", params.dueDate);
  if (params.startDate) formData.set("startDate", params.startDate);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

interface UpdateIssueParams {
  summary?: string;
  description?: string;
  statusId?: number;
  priorityId?: number;
  assigneeId?: number;
  dueDate?: string;
  comment?: string;
}

async function updateIssue(
  config: BacklogConfig,
  issueIdOrKey: string,
  params: UpdateIssueParams
) {
  const url = new URL(`https://${config.domain}/api/v2/issues/${issueIdOrKey}`);
  url.searchParams.set("apiKey", config.apiKey);

  const formData = new URLSearchParams();
  if (params.summary) formData.set("summary", params.summary);
  if (params.description) formData.set("description", params.description);
  if (params.statusId) formData.set("statusId", params.statusId.toString());
  if (params.priorityId) formData.set("priorityId", params.priorityId.toString());
  if (params.assigneeId) formData.set("assigneeId", params.assigneeId.toString());
  if (params.dueDate) formData.set("dueDate", params.dueDate);
  if (params.comment) formData.set("comment", params.comment);

  const response = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

async function addComment(
  config: BacklogConfig,
  issueIdOrKey: string,
  content: string
) {
  const url = new URL(`https://${config.domain}/api/v2/issues/${issueIdOrKey}/comments`);
  url.searchParams.set("apiKey", config.apiKey);

  const formData = new URLSearchParams();
  formData.set("content", content);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

async function getIssueComments(config: BacklogConfig, issueIdOrKey: string) {
  return callApi(config, `issues/${issueIdOrKey}/comments`);
}

async function getNotifications(config: BacklogConfig, count: number = 20) {
  return callApi(config, `notifications?count=${count}`);
}

async function countNotifications(config: BacklogConfig) {
  return callApi(config, "notifications/count");
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.error("Usage: bun run backlog.ts <command> [args...]");
    console.error("Run with --help for available commands");
    process.exit(1);
  }

  if (command === "--help" || command === "-h") {
    console.log(`
Backlog API Client

Commands:
  get-space                          Get space info
  get-myself                         Get authenticated user
  get-users                          List users
  get-priorities                     List priorities
  get-projects [--archived]          List projects
  get-project <projectIdOrKey>       Get project details
  get-issue-types <projectIdOrKey>   List issue types
  get-categories <projectIdOrKey>    List categories
  get-issues [--project=ID] [--status=ID] [--keyword=TEXT] [--count=N]
  get-issue <issueIdOrKey>           Get issue details
  create-issue <json>                Create issue (JSON params)
  update-issue <issueIdOrKey> <json> Update issue (JSON params)
  add-comment <issueIdOrKey> <content>
  get-comments <issueIdOrKey>        Get issue comments
  get-notifications [--count=N]      Get notifications
  count-notifications                Count unread notifications

Environment:
  BACKLOG_DOMAIN  - Backlog space domain (e.g., mycompany.backlog.com)
  BACKLOG_API_KEY - Backlog API key
`);
    process.exit(0);
  }

  try {
    const config = getConfig();
    let result: unknown;

    switch (command) {
      case "get-space":
        result = await getSpace(config);
        break;

      case "get-myself":
        result = await getMyself(config);
        break;

      case "get-users":
        result = await getUsers(config);
        break;

      case "get-priorities":
        result = await getPriorities(config);
        break;

      case "get-projects": {
        const archived = args.includes("--archived");
        result = await getProjects(config, archived ? true : undefined);
        break;
      }

      case "get-project":
        if (!args[1]) throw new Error("projectIdOrKey required");
        result = await getProject(config, args[1]);
        break;

      case "get-issue-types":
        if (!args[1]) throw new Error("projectIdOrKey required");
        result = await getIssueTypes(config, args[1]);
        break;

      case "get-categories":
        if (!args[1]) throw new Error("projectIdOrKey required");
        result = await getCategories(config, args[1]);
        break;

      case "get-issues": {
        const options: GetIssuesOptions = {};
        for (const arg of args.slice(1)) {
          if (arg.startsWith("--project=")) {
            options.projectId = [parseInt(arg.split("=")[1])];
          } else if (arg.startsWith("--status=")) {
            options.statusId = [parseInt(arg.split("=")[1])];
          } else if (arg.startsWith("--priority=")) {
            options.priorityId = [parseInt(arg.split("=")[1])];
          } else if (arg.startsWith("--assignee=")) {
            options.assigneeId = [parseInt(arg.split("=")[1])];
          } else if (arg.startsWith("--keyword=")) {
            options.keyword = arg.split("=")[1];
          } else if (arg.startsWith("--count=")) {
            options.count = parseInt(arg.split("=")[1]);
          } else if (arg.startsWith("--offset=")) {
            options.offset = parseInt(arg.split("=")[1]);
          } else if (arg.startsWith("--sort=")) {
            options.sort = arg.split("=")[1];
          } else if (arg.startsWith("--order=")) {
            options.order = arg.split("=")[1] as "asc" | "desc";
          }
        }
        result = await getIssues(config, options);
        break;
      }

      case "get-issue":
        if (!args[1]) throw new Error("issueIdOrKey required");
        result = await getIssue(config, args[1]);
        break;

      case "create-issue":
        if (!args[1]) throw new Error("JSON params required");
        try {
          result = await createIssue(config, JSON.parse(args[1]));
        } catch (e) {
          if (e instanceof SyntaxError) {
            throw new Error(`Invalid JSON: ${e.message}\nReceived: ${args[1]}`);
          }
          throw e;
        }
        break;

      case "update-issue":
        if (!args[1]) throw new Error("issueIdOrKey required");
        if (!args[2]) throw new Error("JSON params required");
        try {
          result = await updateIssue(config, args[1], JSON.parse(args[2]));
        } catch (e) {
          if (e instanceof SyntaxError) {
            throw new Error(`Invalid JSON: ${e.message}\nReceived: ${args[2]}`);
          }
          throw e;
        }
        break;

      case "add-comment":
        if (!args[1]) throw new Error("issueIdOrKey required");
        if (!args[2]) throw new Error("content required");
        result = await addComment(config, args[1], args[2]);
        break;

      case "get-comments":
        if (!args[1]) throw new Error("issueIdOrKey required");
        result = await getIssueComments(config, args[1]);
        break;

      case "get-notifications": {
        let count = 20;
        for (const arg of args.slice(1)) {
          if (arg.startsWith("--count=")) {
            count = parseInt(arg.split("=")[1]);
          }
        }
        result = await getNotifications(config, count);
        break;
      }

      case "count-notifications":
        result = await countNotifications(config);
        break;

      default:
        throw new Error(`Unknown command: ${command}`);
    }

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
