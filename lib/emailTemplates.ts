export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: "welcome" | "notification" | "support"
  requiredFields: string[]
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: "template-1",
    name: "Welcome Email",
    subject: "Welcome to the New & Improved CopyTradingMarkets!",
    body: `Dear {{name}},

      Thank you for joining our platform! We're excited to have you on board.

      Here are a few things you can do to get started:
      - Complete your profile
      - Explore our features
      - Connect with other users

      If you have any questions, feel free to reach out to our support team.

      Best regards,
      The Team`,
    category: "welcome",
    requiredFields: ["name"],
  },
]