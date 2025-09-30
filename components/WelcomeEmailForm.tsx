"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { EmailTemplate } from "@/lib/emailTemplates"
import { createEmail } from "@/app/actions/emails"

interface WelcomeEmailFormProps {
  template: EmailTemplate
  onClose: () => void
}

export function WelcomeEmailForm({ template, onClose }: WelcomeEmailFormProps) {
  const [recipient, setRecipient] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  
    try {
      const subject = template.subject
      const body = template.body.replace("{{name}}", name)

      console.log("Sending Welcome Email:", {
        to: recipient,
        subject,
        body,
        templateData: {
          name,
        },
      })

      const emailData = {
        from: "admin@ctm.com",
        to: recipient,
        subject: subject,
        message: body,
        status: "pending",
        email_id: `welcome-${Date.now()}`,
      }

      const response = await createEmail(emailData)
      
      if (response.success) {
        toast.success("Email sent successfully!")
        console.log("Email sent successfully:", response.data)
        onClose()
      } else {
        toast.error("Failed to send email: " + response.message)
        console.error("Error sending email:", response.message)
      }
    } catch (error) {
      toast.error("Error sending email")
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipient" className="text-white font-medium">Recipient Email</Label>
        <Input
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="user@example.com"
          className="border-gray-600 bg-gray-800 text-white"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-white font-medium">Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="John Doe" 
          className="border-gray-600 bg-gray-800 text-white"
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white font-medium">New Password</Label>
        <Input 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="*********" 
          className="border-gray-600 bg-gray-800 text-white"
          required 
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="border-gray-500 text-white hover:bg-gray-800">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-app-gold-100 hover:bg-app-gold-200 text-black">
          {isLoading ? "Sending..." : "Send Email"}
        </Button>
      </div>
    </form>
  )
}
