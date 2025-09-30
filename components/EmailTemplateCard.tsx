"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { EmailTemplate } from "@/lib/emailTemplates"
import { WelcomeEmailForm } from "./WelcomeEmailForm"

interface EmailTemplateCardProps {
  template: EmailTemplate
}

export function EmailTemplateCard({ template }: EmailTemplateCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const renderEmailForm = () => {
    switch (template.id) {
      case "template-1":
        return <WelcomeEmailForm template={template} onClose={() => setIsOpen(false)} />
      
      default:
        return null
    }
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white">{template.name}</CardTitle>
              <CardDescription className="text-gray-300">Category: {template.category}</CardDescription>
            </div>
            <Badge variant="secondary">{template.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <span className="font-semibold text-white">Subject:</span> 
            <span className="text-gray-300 ml-2">{template.subject}</span>
          </div>
          <div className="mb-4">
            <span className="font-semibold text-white">Body:</span>
            <p className="text-sm text-gray-300 whitespace-pre-line line-clamp-3 mt-1">{template.body}</p>
          </div>
          <Button 
            onClick={handleOpenModal}
            className="bg-app-gold-100 hover:bg-app-gold-200 text-black w-full"
          >
            Send Email
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Send {template.name}</DialogTitle>
          </DialogHeader>
          {renderEmailForm()}
        </DialogContent>
      </Dialog>
    </>
  )
}
