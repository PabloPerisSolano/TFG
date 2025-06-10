import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui";

export const HomeCaracteristicas = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <Card
          key={idx}
          className="transition-transform duration-200 hover:-translate-y-2 hover:shadow-xl"
        >
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
