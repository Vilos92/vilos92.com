import {z} from 'zod';

import projectsJson from '../projects.json';

/*
 * Schemas.
 */

const projectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  githubUrl: z.url(),
  private: z.boolean()
});

const projectsSchema = z.array(projectSchema);

/*
 * Runtime types.
 */

export type Project = z.infer<typeof projectSchema>;

/*
 * Constants.
 */

export const projects = projectsSchema.parse(projectsJson);

export const publicProjects = projects.filter(project => !project.private);
