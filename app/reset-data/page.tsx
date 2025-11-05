"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ResetDataPage() {
  const router = useRouter()

  const handleReset = () => {
    // Clear jobs data from localStorage to reload with new individual projects
    localStorage.removeItem("jobs")
    
    // Optionally clear all data
    // localStorage.clear()
    
    alert("Data reset! The page will reload to show individual projects.")
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Reset Demo Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to reset the jobs data and reload the demo. This will clear the stored jobs
            and reload them including the new individual project jobs.
          </p>
          <Button onClick={handleReset} className="w-full">
            Reset Jobs Data
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push("/")} 
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

