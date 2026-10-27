"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Award, X } from "lucide-react";
import type { Certificate } from "@/lib/supabase/types";

function isPdf(url: string) {
  try {
    return new URL(url).pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
}

function formatIssuedDate(value: string | null) {
  if (!value) return "Date not listed";
  return new Date(`${value}T12:00:00`).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });
}

function CertificateDialog({
  certificate,
  onClose,
}: {
  certificate: Certificate;
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
      className="certificate-dialog"
      ref={dialogRef}
      aria-labelledby="certificate-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className="certificate-dialog-panel">
        <header className="certificate-dialog-header">
          <div>
            <span className="eyebrow">Certificate / {formatIssuedDate(certificate.issued_on)}</span>
            <h2 id="certificate-dialog-title">{certificate.title}</h2>
            {certificate.issuer && <p>{certificate.issuer}</p>}
          </div>
          <button
            className="certificate-close"
            type="button"
            aria-label="Close certificate"
            onClick={() => dialogRef.current?.close()}
          >
            <X size={20} />
          </button>
        </header>
        <div className="certificate-document">
          {isPdf(certificate.file_url) ? (
            <iframe
              src={`${certificate.file_url}#view=FitH`}
              title={`${certificate.title} certificate`}
            />
          ) : (
            <img src={certificate.file_url} alt={`${certificate.title} certificate`} />
          )}
        </div>
        <footer className="certificate-dialog-footer">
          <p>{certificate.description || "A certificate recognizing completed learning and achievement."}</p>
          <div className="certificate-dialog-actions">
            {certificate.credential_url && (
              <a className="button" href={certificate.credential_url} target="_blank" rel="noreferrer">
                Verify credential <ArrowUpRight size={15} />
              </a>
            )}
            <a className="button primary" href={certificate.file_url} target="_blank" rel="noreferrer" download>
              Open or download <ArrowDownToLine size={15} />
            </a>
          </div>
        </footer>
      </div>
    </dialog>
  );
}

export default function CertificateViewer({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <>
      {certificates.length ? (
        <div className="certificate-grid">
          {certificates.map((certificate, index) => (
            <button
              className="certificate-card"
              key={certificate.id}
              type="button"
              onClick={() => setSelected(certificate)}
              aria-label={`View certificate: ${certificate.title}`}
            >
              <span className={`certificate-card-art certificate-card-art-${index % 4}`}>
                <span className="certificate-card-seal"><Award size={28} /></span>
                <span className="certificate-card-label">CERTIFICATE</span>
                <strong>{certificate.title}</strong>
                <span className="certificate-card-rule" />
                <span className="certificate-card-issuer">{certificate.issuer || "Ayamikani Rukundo Emmanuel"}</span>
              </span>
              <span className="certificate-card-meta">
                <span>{certificate.issuer || "Certificate"} · {formatIssuedDate(certificate.issued_on)}</span>
                <span className="certificate-card-open">View <ArrowUpRight size={14} /></span>
              </span>
              {certificate.featured && <span className="certificate-featured">Featured</span>}
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-note">
          <strong>A collection in the making.</strong>
          Certificates and learning milestones will appear here as they are added.
        </div>
      )}
      {selected && (
        <CertificateDialog
          certificate={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
