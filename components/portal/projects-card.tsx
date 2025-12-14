"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, ArrowRight } from "lucide-react";
import { Project } from "@/types/firestore";

interface ProjectsCardProps {
    projects: Project[];
}

export function ProjectsCard({ projects }: ProjectsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Card className="h-full bg-card/40 border-white/10 backdrop-blur-md shadow-neumo hover:border-nyembo-sky/30 transition-all group">
                <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-nyembo-sky/10 flex items-center justify-center mb-4 group-hover:bg-nyembo-sky group-hover:text-black transition-colors text-nyembo-sky">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl text-white">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div key={project.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-nyembo-sky/20 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white">{project.title}</h4>
                                    <Badge className="bg-nyembo-yellow text-black hover:bg-nyembo-yellow">{project.status}</Badge>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="bg-nyembo-sky h-full"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Updated: {project.updatedAt?.toDate().toLocaleDateString()}</p>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-nyembo-sky hover:text-white hover:bg-white/5 justify-between group/btn">
                            View all projects <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
