import { SelectedAlbumWithMeta, useSelectedAlbumStore } from "@/services/useSelectedAlbumStore";
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useLocalStorage from "@/hooks/useLocalStorage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Calendar, ChevronLeft, ListOrdered, Timer, User } from "lucide-react";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import BannerAccordion from "./BannerAccordion";
import { PresContentResponse, usePresContentResponseStore } from "@/services/useTorrentContentResponseStore";
import { useState } from "react";
import LoadingButton from "./LoadingButton";
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  id: z.number(),
  codec: z.string().max(18),
  frequency: z.string().max(18),
  // https://github.com/colinhacks/zod#coercion-for-primitives
  audioBitRate: z.coerce.number().nonnegative(),
  nbFiles: z.coerce.number().max(100),
  totalSize: z.coerce.string(),
  sizeUnit: z.string().max(2),
  bannerTheme: z.string().max(50),
  accountLink: z.string().max(100),
  tag: z.string().max(50),
})

export const PreviewCardPres: React.FC<SelectedAlbumWithMeta> = ({
  id, title, performer, nbTracks, duration, cover, releaseDate
}) => {
  const keysToStore = ['ripper', 'uploader', 'tag', 'accountLink', 'bannerTheme'];
  const [accountLink] = useLocalStorage('accountLink', '');
  const [bannerTheme] = useLocalStorage('bannerTheme', 'play_banners_purple');
  const [tag] = useLocalStorage('tag', '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clearSelectedAlbum = useSelectedAlbumStore(state => state.clearSelectedAlbum);
  const { setPresContentResponse } = usePresContentResponseStore();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: id,
      codec: "MP3",
      frequency: "44.1 kHz",
      audioBitRate: 320,
      nbFiles: nbTracks + 1,
      totalSize: "0",
      sizeUnit: "MB",
      bannerTheme,
      accountLink,
      tag,
    },
  })

  const getPresContent = async (data: string): Promise<PresContentResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/pres`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const data = {
      id: values.id,
      settings: {
        codec: values.codec,
        frequency: values.frequency,
        audioBitRate: values.audioBitRate,
        nbFiles: values.nbFiles,
        totalSize: values.totalSize,
        sizeUnit: values.sizeUnit,
        bannerTheme: values.bannerTheme,
        accountLink: values.accountLink,
        tag: values.tag
      }
    };

    for (const [key, value] of Object.entries(values)) {
      if (keysToStore.includes(key)) {
        localStorage.setItem(key, value.toString());
      }
    }
    
    toast.promise(
      getPresContent(JSON.stringify(data)),
      {
        loading: 'Generate presentation...',
        success: (res) => {
          setPresContentResponse(res);
          return 'Presentation successfully generated'
        },
        error: (err) => {
          setIsSubmitting(false);
          return `${err.toString()}`
        },
      },
    );
  }

  const handleGoBack = () => {
    clearSelectedAlbum();
  }

  return (
      <div className="flex space-x-6 w-11/12 lg:w-1/2 border border-[#8C52FF] rounded p-10">
        <div className="w-1/2 space-y-2">
          <Button size="icon" onClick={handleGoBack}><ChevronLeft className="h-[1.2rem] w-[1.2rem]" /></Button>
          <h1 className="text-2xl font-bold">{title}</h1>
          <img src={cover} alt={`Cover of ${title}`} className="rounded-lg" />
          <div className="space-y-4">
            <div className="flex space-x-2">
              <User />
              <h2 className="">{performer}</h2>
            </div>
            <div className="flex space-x-2">
              <ListOrdered />
              <span className="">{nbTracks} tracks</span>
            </div>
            <div className="flex space-x-2">
              <Timer />
              <span className="">{duration}</span>
            </div>
            <div className="flex space-x-2">
              <Calendar />
              <span className="">{releaseDate}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between w-1/2 space-y-6">
          <Tabs defaultValue="form">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Infos (optional)</TabsTrigger>
              <TabsTrigger value="banner">Banners</TabsTrigger>
            </TabsList>
            <TabsContent value="form">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="codec"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Codec</FormLabel> 
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MP3">MP3</SelectItem>
                          <Separator/>
                          <SelectItem value="FLAC (16 bits)">FLAC (16 bits)</SelectItem>
                          <SelectItem value="FLAC (24 bits)">FLAC (24 bits)</SelectItem>
                          <Separator/>
                          <SelectItem value="WAV">WAV</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel> 
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="44.1 kHz">44.1 kHz</SelectItem>
                          <SelectItem value="48 kHz">48 kHz</SelectItem>
                          <SelectItem value="88.2 kHz">88.2 kHz</SelectItem>
                          <SelectItem value="96 kHz">96 kHz</SelectItem>
                          <SelectItem value="176.4 kHz">176.4 kHz</SelectItem>
                          <SelectItem value="196 kHz">196 kHz</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="audioBitRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audio bit rate </FormLabel>
                      <Badge variant="outline">kb/s</Badge>
                      <FormControl>
                        <Input placeholder={field.value.toString()} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nbFiles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. of files</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="totalSize"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Total size</FormLabel>
                        <FormControl>
                          <Input type="string" placeholder="300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sizeUnit"
                    render={({ field }) => (
                      <FormItem >
                        <FormLabel>Unit</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={field.value} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MB">MB</SelectItem>
                            <SelectItem value="GO">GO</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="accountLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://.." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uploader tag</FormLabel>
                      <FormControl>
                        <Input placeholder="TAG" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bannerTheme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banners theme</FormLabel> 
                      <Select onValueChange={field.onChange} defaultValue={bannerTheme}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="play_banners_purple">Play banners (purple)</SelectItem>
                          <SelectItem value="play_banners_orange">Play banners (orange)</SelectItem>
                          <SelectItem value="kk_banners_blue">KK banners (blue)</SelectItem>
                          <SelectItem value="kk_banners_orange">KK banners (orange)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <LoadingButton isLoading={isSubmitting} text="Generate my presentation" />
              </form>
            </Form>
            </TabsContent>
            <TabsContent value="banner">
              <BannerAccordion />
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
};