import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function NewPost() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <Label className="text-xl font-bold">New Post</Label>
      <Textarea className="min-h-[100px]" />
      <Button className="w-32" type="submit">
        Submit
      </Button>
    </div>
  );
}
