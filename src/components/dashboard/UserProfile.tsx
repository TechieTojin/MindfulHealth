
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

type UserProfileProps = {
  name: string;
  bio?: string;
  avatar?: string;
  completionRate: number;
  streakDays: number;
};

const UserProfile = ({
  name,
  bio = "Fitness enthusiast focused on holistic health",
  avatar,
  completionRate,
  streakDays,
}: UserProfileProps) => {
  return (
    <Card className="health-stat-card">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-14 w-14 border-2 border-health-primary">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-health-primary text-white">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{bio}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Today's Progress</span>
              <span className="text-sm font-medium">{completionRate}%</span>
            </div>
            {/* Remove the indicatorClassName prop and style the Progress component properly */}
            <Progress value={completionRate} className="h-2 bg-muted" />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
              <div className="text-xl font-bold text-health-primary">{streakDays} days</div>
            </div>
            <div className="flex space-x-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`h-6 w-2 rounded-full ${
                    i < streakDays % 7 ? "bg-health-primary" : "bg-muted"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
