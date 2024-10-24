import { CloudRain } from "lucide-react";

const features = [
  {
    name: "It's completely free",
    description:
      "Education is a privilege, not a right. It's important to remember that. Let us who have that privilege help those who don't.",
    icon: CloudRain,
  },
  {
    name: "Community driven",
    description:
      "Upload whatever you found useful when you were studying, and help those who are struggling to find the same resources.",
    icon: CloudRain,
  },
  {
    name: "Tons of opportunities",
    description:
      "There are so many opportunities that go missed because of the lack of resources, communication and networking. Lets change that!",
    icon: CloudRain,
  },
  {
    name: "No limits",
    description:
      "No limits?",
    icon: CloudRain,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary">Work faster</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Why keep suffering from not knowing where to find anything?
        </h1>
        <p className="mt-6 text-base leading-snug text-muted-foreground">
           This site is a collection of resources for students to learn from.
           It is a community driven approach to finding a solution to organising
           storing and finding resources for students.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <div className="text-base font-semibold leading-7">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                {feature.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}