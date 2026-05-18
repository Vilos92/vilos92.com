import projectsJson from '../projects.json';

/*
 * Types.
 */

export type Project = {
  slug: string;
  name: string;
  githubUrl: string;
  private: boolean;
};

/*
 * API.
 */

export const projects = projectsJson as Project[];

export const publicProjects = projects.filter(project => !project.private);
