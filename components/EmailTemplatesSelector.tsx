"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type EmailTemplate, emailTemplates } from "@/lib/emailTemplates"

interface EmailTemplateSelectorProps {
  onSelectTemplate: (template: EmailTemplate) => void
}

export function EmailTemplateSelector({ onSelectTemplate }: EmailTemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const categories = Array.from(new Set(emailTemplates.map((template) => template.category)))

  const handleSelectTemplate = (template: EmailTemplate) => {
    onSelectTemplate(template)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Use Template</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Email Templates</DialogTitle>
          <DialogDescription>Select a template to use for your email.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={categories[0]}>
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-1 gap-4">
                  {emailTemplates
                    .filter((template) => template.category === category)
                    .map((template) => (
                      <Card key={template.id}>
                        <CardHeader>
                          <CardTitle>{template.name}</CardTitle>
                          <CardDescription>Subject: {template.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm whitespace-pre-line line-clamp-3">{template.body}</p>
                        </CardContent>
                        <CardFooter>
                          <Button onClick={() => handleSelectTemplate(template)}>Use Template</Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
