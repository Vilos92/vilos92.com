import projectsJson from './projects.json';

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
 * Constants.
 */

export const GITHUB_PROFILE_URL = 'https://github.com/Vilos92';

/*
 * API.
 */

export const projects = projectsJson as Project[];

export const projectsBySlug = new Map(projects.map(project => [project.slug, project]));

export const publicProjects = projects.filter(project => !project.private);
