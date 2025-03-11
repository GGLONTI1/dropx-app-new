import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid gap-10 lg:grid-cols-2 items-stretch">
        <div className="space-y-6 h-full flex flex-col">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Get in touch</h1>
          </div>
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <form className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message"
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                className="flex w-full bg-green-800 hover:bg-green-600 text-white"
                type="submit"
              >
                Submit
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Find us using the information below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <div className="flex items-start space-x-4">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Our Address</p>
                <p className="text-sm text-muted-foreground">
                  Elene Akhvlediani Khevi 21
                  <br />
                  Tbilisi, 0102
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  (+995) 500-700-866
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  dropx-support@gmail.com
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Business Hours</p>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday: 9:00 AM - 5:00 PM
                  <br />
                  Saturday: 10:00 AM - 2:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
