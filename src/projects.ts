import projectsJson from './projects.json';

export type Project = {
  slug: string;
  name: string;
  githubUrl: string;
  private: boolean;
};

export const GITHUB_PROFILE_URL = 'https://github.com/Vilos92';

export const projects = projectsJson as Project[];

export const projectsBySlug = new Map(projects.map(project => [project.slug, project]));

export const publicProjects = projects.filter(project => !project.private);
