import { useEffect, useState } from "react";
import { Brain, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CodingHeader from "../components/coding/CodingHeader";
import CodeEditor from "../components/coding/CodeEditor";
import TestCasePanel from "../components/coding/TestCasePanel";

const starterCode = {
  JavaScript: `function twoSum(nums, target) {
  // Write your solution here

}`,
  Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here

    }
}`,
  Python: `def twoSum(nums, target):
    # Write your solution here
    pass`,
  "C++": `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here

    }
};`,
};

function CodingInterview() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(starterCode.JavaScript);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [output, setOutput] = useState("Run your code to see output.");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(starterCode[value]);
    setOutput("Run your code to see output.");
    setSubmitted(false);
  };

  const handleRun = () => {
    setOutput("[0, 1]");
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setOutput("[0, 1]");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <CodingHeader
        language={language}
        setLanguage={handleLanguageChange}
        timeLeft={timeLeft}
        onRun={handleRun}
        onSubmit={handleSubmit}
      />

      <main className="mx-auto max-w-[1600px] p-4 lg:p-6">
        <button
          type="button"
          onClick={() => navigate("/interview/live")}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to interview
        </button>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Problem */}
          <section className="rounded-xl border bg-background p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                <Brain className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Technical · Arrays
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Two Sum
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-5 text-sm leading-6">
              <p>
                Given an array of integers <code>nums</code> and an integer
                <code> target</code>, return the indices of the two numbers
                such that they add up to target.
              </p>

              <p>
                You may assume that each input has exactly one solution,
                and you may not use the same element twice.
              </p>

              <div>
                <h3 className="font-medium">Example</h3>

                <pre className="mt-2 overflow-x-auto rounded-lg border bg-muted/40 p-4 font-mono text-xs">
{`Input:
nums = [2,7,11,15]
target = 9

Output:
[0,1]`}
                </pre>
              </div>

              <div>
                <h3 className="font-medium">Constraints</h3>

                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>2 ≤ nums.length ≤ 10⁴</li>
                  <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                  <li>-10⁹ ≤ target ≤ 10⁹</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Editor */}
          <div className="flex min-h-0 flex-col gap-5">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
            />

            <TestCasePanel
              output={output}
              submitted={submitted}
            />

            {submitted && (
              <section className="rounded-xl border bg-muted/30 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                    <Brain className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold">
                      AI explanation
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Feedback will be generated after backend AI
                      integration.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Your current solution has been submitted successfully.
                  Once AI evaluation is connected, this section will
                  explain your approach, complexity, mistakes, and possible
                  improvements.
                </p>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CodingInterview;