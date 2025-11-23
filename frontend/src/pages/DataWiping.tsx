import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, FileX, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import RobotMascot from "@/components/RobotMascot";

const DataWiping = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [wipingPass, setWipingPass] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentFile, setCurrentFile] = useState("");

  // Backend URL - change this if deploying
  const BACKEND_URL = "http://localhost:5000";

  // --------------------------
  // FILE SELECTION - REAL FILE DIALOG
  // --------------------------
  const handleBrowseFiles = async () => {
    try {
      
      const response = await fetch(`${BACKEND_URL}/api/browse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to browse files");
      }

      const data = await response.json();
      
      if (data.files && data.files.length > 0) {
        setSelectedFiles(data.files);
        toast.success(`${data.files.length} file(s) selected`);
      } else {
        toast.info("No files selected");
      }
    } catch (error) {
      console.error("Browse error:", error);
      toast.error("Could not connect to backend. Make sure Flask is running on port 5000!");
    }
  };

  const handleWipeAll = () => {
    setSelectedFiles(["All system data"]);
    toast.info("Selected: All system data");
  };

  // --------------------------
  // ACTUAL BACKEND INTEGRATION
  // --------------------------
  const handleProceed = async () => {
    if (!agreed) {
      toast.error("Please agree to proceed with data deletion");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("No files selected");
      return;
    }



    setIsWiping(true);
    setWipingPass(0);
    setCurrentFile("");

    const sessionId = crypto.randomUUID();

    try {
      // 1️⃣ START WIPE OPERATION
      const startRes = await fetch(`${BACKEND_URL}/api/wipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: selectedFiles,
          wipeAll: selectedFiles.includes("All system data"),
          sessionId,
        }),
      });

      if (!startRes.ok) {
        throw new Error("Failed to start wipe operation");
      }

      const startData = await startRes.json();
      
      if (!startData.sessionId) {
        throw new Error("Invalid session response");
      }

  

      // 2️⃣ POLL STATUS EVERY 500ms
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(
            `${BACKEND_URL}/api/wipe/status/${sessionId}`
          );

          if (!statusRes.ok) {
            throw new Error("Failed to get status");
          }

          const statusData = await statusRes.json();

          setWipingPass(statusData.pass ?? 0);
          setCurrentFile(statusData.currentFile ?? "");

          // Check if complete
          if (statusData.complete) {
            clearInterval(pollInterval);
            setIsWiping(false);

            if (statusData.success) {
              setIsComplete(true);
            } else {
              toast.error("Wipe operation failed");
            }
          }
        } catch (error) {
          console.error("Status poll error:", error);
          clearInterval(pollInterval);
          setIsWiping(false);
          toast.error("Lost connection to backend");
        }
      }, 500);

    } catch (error) {
      console.error("Wipe error:", error);
      toast.error("Failed to connect to backend. Is Flask running on port 5000?");
      setIsWiping(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Secure Data Wiping</h1>
          <p className="text-muted-foreground">Military-grade data destruction for your peace of mind</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT INFO PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel rounded-2xl p-8 glow-soft"
          >
            <div className="flex items-start space-x-4 mb-6">
              <Shield className="w-12 h-12 text-accent flex-shrink-0 animate-glow-pulse" />
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">DoD 5220.22-M Standard</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We use the DoD 3-pass overwrite method to ensure safe and permanent data destruction.
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Pass 1: Zero pattern (0x00)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Pass 2: One pattern (0xFF)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Pass 3: Random characters</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 border-2 border-destructive/50 mt-6">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Critical Warning</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Data once deleted cannot be recovered. This is permanent and irreversible.
              </p>
            </div>
          </motion.div>

          {/* RIGHT CONTROL PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel rounded-2xl p-6 space-y-6"
          >
            <h3 className="text-xl font-semibold gradient-text-accent">Wipe Your Data Securely</h3>

            <div className="space-y-3">
              <Button
                onClick={handleWipeAll}
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                disabled={isWiping}
              >
                <FileX className="w-4 h-4 mr-2" />
                Wipe All Data
              </Button>

              <Button
                onClick={handleBrowseFiles}
                variant="outline"
                className="w-full border-accent/50 hover:bg-accent/10"
                disabled={isWiping}
              >
                Browse for Files
              </Button>
            </div>

            {/* FILE LIST */}
            {selectedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="glass-panel rounded-xl p-4 space-y-2"
              >
                <p className="text-sm font-semibold text-muted-foreground">
                  Selected Files ({selectedFiles.length}):
                </p>
                <div className="space-y-1 max-h-32 overflow-auto">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="text-sm text-foreground/80 flex items-center space-x-2">
                      <FileX className="w-3 h-3 text-accent" />
                      <span className="truncate" title={file}>{file}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AGREEMENT CHECKBOX */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                disabled={isWiping}
              />
              <label htmlFor="agree" className="text-sm leading-relaxed text-foreground/80 cursor-pointer">
                I understand this action is <strong>irreversible</strong> and agree to proceed with permanent data deletion.
              </label>
            </div>

            {/* PROCEED BUTTON */}
            <Button
              onClick={handleProceed}
              disabled={selectedFiles.length === 0 || !agreed || isWiping}
              className="w-full bg-primary hover:bg-primary/90 glow-primary"
            >
              {isWiping ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed with Deletion"
              )}
            </Button>
          </motion.div>
        </div>

        {/* WIPING MODAL */}
        <AnimatePresence>
          {isWiping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center"
            >
              <div className="glass-panel rounded-3xl p-12 text-center space-y-6 glow-primary max-w-lg">
                <Loader2 className="w-16 h-16 text-accent mx-auto animate-spin" />
                <h2 className="text-3xl font-bold gradient-text">Wiping Data</h2>
                <div className="text-6xl font-bold text-primary">{wipingPass}/3</div>
                <p className="text-muted-foreground">Pass {wipingPass} of 3</p>
                {currentFile && (
                  <p className="text-sm text-muted-foreground truncate max-w-md">
                    Current: {currentFile}
                  </p>
                )}
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(wipingPass / 3) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMPLETION SCREEN */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center"
            >
              <div className="glass-panel rounded-3xl p-12 text-center space-y-6 glow-accent max-w-md">
                <RobotMascot size="md" expression="happy" />
                <CheckCircle2 className="w-20 h-20 text-accent mx-auto animate-glow-pulse" />
                <h2 className="text-3xl font-bold gradient-text-accent">Complete!</h2>

                <p className="text-muted-foreground">
                  Your data has been securely wiped using DoD 5220.22-M standards.
                  Recovery is impossible.
                </p>

                <Button
                  onClick={() => {
                    setIsComplete(false);
                    setSelectedFiles([]);
                    setAgreed(false);
                    setWipingPass(0);
                    setCurrentFile("");
                  }}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DataWiping;