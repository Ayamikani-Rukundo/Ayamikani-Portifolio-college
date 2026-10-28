"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Code2, ExternalLink, X } from "lucide-react";
import type { Project } from "@/lib/supabase/types";
import PortfolioImage from "@/components/portfolio-image";

function ProjectDialog({
  project,
  index,
  onClose,
}: {
  project: Project;
  index: number;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      className="project-dialog"
      ref={dialogRef}
      aria-labelledby="project-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <article className="project-dialog-panel">
        <div className="project-dialog-media">
          <PortfolioImage
            src={project.cover_image_url}
            alt={`${project.title} project`}
            className="project-dialog-image"
            tone={index}
          />
          <span className="project-dialog-index">PROJECT / {String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="project-dialog-content">
          <header className="project-dialog-header">
            <div className="eyebrow">{project.featured ? "Featured work" : "Selected work"}</div>
            <button
              className="certificate-close"
              type="button"
              aria-label="Close project details"
              onClick={() => dialogRef.current?.close()}
            >
              <X size={20} />
            </button>
          </header>
          <h2 id="project-dialog-title">{project.title}</h2>
          <p className="project-dialog-summary">{project.summary}</p>
          <div className="project-dialog-description">
            {project.description
              ? project.description.split(/\n{2,}/).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))
              : <p>This project is still finding its words.</p>}
          </div>
          {project.tech_stack.length > 0 && (
            <div className="project-dialog-toolkit">
              <span className="eyebrow"><Code2 size={13} /> Built with</span>
              <div className="project-tech">
                {project.tech_stack.map((technology) => <span key={technology}>{technology}</span>)}
              </div>
            </div>
          )}
          <div className="project-dialog-actions">
            {project.live_url && (
              <a className="button primary" href={project.live_url} target="_blank" rel="noreferrer">
                Visit project <ExternalLink size={14} />
              </a>
            )}
            {project.repo_url && (
              <a className="button" href={project.repo_url} target="_blank" rel="noreferrer">
                Source code <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </article>
    </dialog>
  );
}

export default function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<{ project: Project; index: number } | null>(null);

  return (
    <>
      {projects.length ? (
        <div className="projects-timeline">
          {projects.map((project, index) => (
            <article className="project-entry" key={project.id}>
              <div className="project-entry-marker">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <button
                className="project-entry-button"
                type="button"
                onClick={() => setSelected({ project, index })}
                aria-label={`View project: ${project.title}`}
              >
                <span className="project-entry-image-wrap">
                  <PortfolioImage
                    src={project.cover_image_url}
                    alt={`${project.title} preview`}
                    className="project-entry-image"
                    tone={index}
                  />
                  <span className="project-entry-open"><ArrowDownRight size={17} /></span>
                </span>
                <span className="project-entry-copy">
                  <span className="project-entry-topline">
                    <span className="eyebrow">{project.featured ? "Featured project" : "Project"}</span>
                    {project.featured && <span className="project-featured">Selected work</span>}
                  </span>
                  <span className="project-entry-title">{project.title}</span>
                  <span className="project-entry-summary">{project.summary || "A work in progress, built with care."}</span>
                  {project.tech_stack.length > 0 && (
                    <span className="project-entry-tech">
                      {project.tech_stack.slice(0, 4).map((technology) => <span key={technology}>{technology}</span>)}
                      {project.tech_stack.length > 4 && <span>+{project.tech_stack.length - 4}</span>}
                    </span>
                  )}
                  <span className="project-entry-prompt">Explore the project <ArrowUpRight size={14} /></span>
                </span>
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-note">
          <strong>The workbench is being set.</strong>
          No projects have been published yet. Check back when there’s something worth sharing.
        </div>
      )}
      {selected && (
        <ProjectDialog
          project={selected.project}
          index={selected.index}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
