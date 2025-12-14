import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background p-10 space-y-10 text-foreground">
      <h1 className="text-4xl font-bold tracking-tight text-nyembo-white uppercase">Nyembotech Design System</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-nyembo-sky">Colors</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="h-20 rounded-lg bg-nyembo-yellow flex items-center justify-center text-black font-bold">Yellow</div>
          <div className="h-20 rounded-lg bg-nyembo-gold flex items-center justify-center text-black font-bold">Gold</div>
          <div className="h-20 rounded-lg bg-nyembo-red flex items-center justify-center text-white font-bold">Red</div>
          <div className="h-20 rounded-lg bg-nyembo-sky flex items-center justify-center text-black font-bold">Sky</div>
          <div className="h-20 rounded-lg bg-nyembo-white flex items-center justify-center text-black font-bold">White</div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-nyembo-sky">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-nyembo-yellow text-black hover:bg-nyembo-gold shadow-neumo">Primary Action</Button>
          <Button variant="outline" className="border-nyembo-sky text-nyembo-sky hover:bg-nyembo-sky/10 hover:text-nyembo-sky">Secondary Action</Button>
          <Button variant="destructive" className="bg-nyembo-red hover:bg-red-600 shadow-neumo">Destructive</Button>
          <Button variant="ghost" className="text-nyembo-sky hover:text-nyembo-white hover:bg-white/5">Ghost Button</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-nyembo-sky">Cards (Futuristic)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-nyembo-sky/20 shadow-neumo card-floating">
            <CardHeader>
              <CardTitle className="text-nyembo-white">Standard Card</CardTitle>
              <CardDescription className="text-muted-foreground">Basic container for content.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content goes here. Using the neumorphic shadow and floating effect.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="bg-nyembo-yellow text-black hover:bg-nyembo-gold">Explore</Button>
            </CardFooter>
          </Card>

          <Card className="bg-card border-nyembo-yellow/50 shadow-[0_0_15px_rgba(246,227,15,0.2)] card-floating relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-nyembo-yellow"></div>
            <CardHeader>
              <CardTitle className="text-nyembo-yellow">Highlighted Card</CardTitle>
              <CardDescription>With glowing border effect.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card uses a glow effect and a side accent.</p>
            </CardContent>
          </Card>

          <Card className="bg-transparent border border-nyembo-sky/30 backdrop-blur-md shadow-none">
             <CardHeader>
              <CardTitle className="text-nyembo-sky">Glass / Ghost Card</CardTitle>
              <CardDescription>Transparent background.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Useful for overlays or less emphasized content.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-nyembo-sky">Inputs</h2>
        <div className="w-full max-w-sm space-y-4">
          <Input placeholder="Standard Input" className="bg-input/50 border-nyembo-sky/20 focus-visible:ring-nyembo-sky" />
          <div className="relative">
            <Input placeholder="Search..." className="pl-10 bg-input/50 border-nyembo-sky/20 rounded-full" />
            <span className="absolute left-3 top-2.5 text-muted-foreground">🔍</span>
          </div>
        </div>
      </section>
    </div>
  );
}
