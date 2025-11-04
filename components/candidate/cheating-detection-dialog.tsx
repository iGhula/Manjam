"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n/use-translation"

interface CheatingDetectionDialogProps {
  open: boolean
  onAgree: () => void
  onClose: () => void
}

export default function CheatingDetectionDialog({
  open,
  onAgree,
  onClose,
}: CheatingDetectionDialogProps) {
  const t = useTranslation()
  const [agreed, setAgreed] = useState(false)

  const handleAgree = () => {
    if (agreed) {
      onAgree()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-danger" />
            <DialogTitle className="text-2xl font-bold">
              {t.assessments.cheatingDetectionTitle}
            </DialogTitle>
          </div>
          <DialogDescription className="text-lg font-semibold text-danger">
            {t.assessments.cheatingDetectionWarning}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-base">
            {t.assessments.cheatingDetectionInfo}
          </p>

          <ul className="space-y-2 list-disc list-inside text-sm bg-danger/5 border border-danger/20 rounded-lg p-4">
            <li>{t.assessments.cheatingDetectionList1}</li>
            <li>{t.assessments.cheatingDetectionList2}</li>
            <li>{t.assessments.cheatingDetectionList3}</li>
            <li>{t.assessments.cheatingDetectionList4}</li>
          </ul>

          <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <input
              type="checkbox"
              id="cheating-agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-5 w-5 cursor-pointer"
            />
            <label
              htmlFor="cheating-agreement"
              className="text-sm cursor-pointer flex-1"
            >
              {t.assessments.cheatingDetectionAgreement}
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="btn-enhanced"
          >
            {t.common.cancel}
          </Button>
          <Button
            onClick={handleAgree}
            disabled={!agreed}
            className="btn-enhanced hover-lift shadow-brand"
          >
            <CheckCircle2 className="ml-2 h-5 w-5" />
            {t.assessments.agreeAndStart}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

