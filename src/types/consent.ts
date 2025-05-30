
export interface ConsentLog {
  id: string;
  user_id: string;
  consent_type: string;
  consent_given: boolean;
  ip_address?: string;
  user_agent?: string;
  device_info?: {
    userAgent: string;
    platform: string;
    language: string;
    cookieEnabled: boolean;
    onLine: boolean;
    screen: {
      width: number;
      height: number;
    };
    viewport: {
      width: number;
      height: number;
    };
  };
  created_at: string;
}

export interface ConsentLogResponse {
  success: boolean;
  data?: ConsentLog[];
  error?: any;
}
