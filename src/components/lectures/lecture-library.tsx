
"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { getLectures, addLecture } from '@/lib/lectures';
import type { Lecture } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Clapperboard, Play, Upload, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const VideoPlayerDialog = ({ lecture, children }: { lecture: Lecture, children: React.ReactNode }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{lecture.title}</DialogTitle>
                    <DialogDescription>{lecture.channel} • {lecture.subject}</DialogDescription>
                </DialogHeader>
                <div className="aspect-video bg-black rounded-lg">
                    <video
                        controls
                        src={lecture.videoUrl}
                        className="w-full h-full"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </DialogContent>
        </Dialog>
    )
}


const LectureCard = ({ lecture }: { lecture: Lecture }) => {
  return (
    <VideoPlayerDialog lecture={lecture}>
        <div className="block group cursor-pointer">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-video">
                <Image 
                    src={lecture.thumbnailUrl} 
                    alt={`Thumbnail for ${lecture.title}`} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Play className="h-12 w-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform" />
                </div>
                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white border-none text-xs">{lecture.duration}</Badge>
                </div>
                <CardContent className="p-4 flex-grow">
                <Badge variant={lecture.subject === 'Physics' ? 'default' : lecture.subject === 'Chemistry' ? 'destructive' : 'secondary'} className="mb-2">
                    {lecture.subject}
                </Badge>
                <h3 className="font-semibold text-base line-clamp-2">{lecture.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{lecture.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground font-medium">{lecture.channel}</p>
                </CardFooter>
            </Card>
        </div>
    </VideoPlayerDialog>
  );
};

/*
const UploadLectureDialog = ({ onUploadComplete }: { onUploadComplete: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [channel, setChannel] = useState('');
    const [duration, setDuration] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const { toast } = useToast();

    const canSubmit = useMemo(() => {
        return !!videoFile;
    }, [videoFile]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSubject('');
        setChannel('');
        setDuration('');
        setVideoFile(null);
    }

    const handleSubmit = async () => {
        if (!videoFile) return;
        setIsSaving(true);
        try {
            await addLecture({ 
                title: title || "Test Video",
                description: description || "A test video upload.",
                subject: subject || "Chemistry",
                channel: channel || "Test Channel",
                duration: duration || "0:30",
                videoFile 
            });
            toast({ title: 'Success!', description: 'Your lecture has been uploaded.' });
            onUploadComplete();
            resetForm();
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            toast({ title: 'Upload Failed', description: 'Could not upload the lecture video.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    }
    
    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Lecture
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload New Lecture</DialogTitle>
                    <DialogDescription>Fill in the details and select a video file to upload.</DialogDescription>
                </DialogHeader>
                 <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Intro to Kinematics" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief summary of the lecture" />
                    </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="subject">Subject</Label>
                        <Select onValueChange={setSubject} value={subject}>
                            <SelectTrigger id="subject">
                                <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Physics">Physics</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Maths">Maths</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="channel">Channel</Label>
                        <Input id="channel" value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="e.g., Physics Wallah" />
                    </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 1:45:12" />
                    </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="video">Video File</Label>
                        <Input id="video" type="file" onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)} accept="video/*"/>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSaving || !canSubmit}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upload and Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
*/

export default function LectureLibrary() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLectures = async () => {
    setIsLoading(true);
    const fetchedLectures = await getLectures();
    setLectures(fetchedLectures);
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchLectures();
  }, []);

  const filteredLectures = useMemo(() => {
    if (!searchTerm) return lectures;
    const lowercasedTerm = searchTerm.toLowerCase();
    return lectures.filter(lecture => 
      lecture.title.toLowerCase().includes(lowercasedTerm) ||
      lecture.description.toLowerCase().includes(lowercasedTerm) ||
      lecture.subject.toLowerCase().includes(lowercasedTerm) ||
      lecture.channel.toLowerCase().includes(lowercasedTerm)
    );
  }, [lectures, searchTerm]);

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search for lectures by title, subject, or channel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
        </div>
        {/* <UploadLectureDialog onUploadComplete={fetchLectures} /> */}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredLectures.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLectures.map(lecture => (
            <LectureCard key={lecture.id} lecture={lecture} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[40vh]">
          <Clapperboard className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No Lectures Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or upload a new lecture.</p>
        </div>
      )}
    </div>
  );
}
