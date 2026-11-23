import React, { useState, type ComponentProps, type ReactNode } from 'react';

export const Surface = ({
  inset = false,
  className = '',
  ...props
}: ComponentProps<'div'> & { inset?: boolean }) => (
  <div
    className={`min-w-0 rounded-card text-foreground ${
      inset ? 'bg-background' : 'bg-surface border border-border'
    } ${className}`}
    {...props}
  />
);

const buttonTones = {
  primary: 'bg-primary text-primary-foreground hover:bg-foreground/90',
  secondary: 'bg-background text-foreground border border-foreground hover:bg-foreground hover:text-surface',
  quiet: 'border border-border bg-surface text-foreground hover:border-foreground',
  accent: 'bg-accent text-foreground hover:brightness-95',
  whatsapp: 'bg-whatsapp text-surface hover:brightness-95',
  ghost: 'text-foreground hover:bg-accent/30',
};

export const Button = ({
  tone = 'primary',
  type = 'button',
  className = '',
  ...props
}: ComponentProps<'button'> & { tone?: keyof typeof buttonTones }) => (
  <button
    type={type}
    className={`inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-control px-5 text-sm font-medium transition-colors duration-150 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-45 ${buttonTones[tone]} ${className}`}
    {...props}
  />
);

export const Field = ({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className = '',
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) => (
  <div className={`min-w-0 flex flex-col gap-1.5 ${className}`}>
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {label}
      {required ? <span className="ml-1 text-muted">*</span> : null}
    </label>
    {children}
    {hint && !error ? <p className="text-xs text-muted">{hint}</p> : null}
    {error ? (
      <p role="alert" className="text-xs font-medium text-danger">
        {error}
      </p>
    ) : null}
  </div>
);

export const inputBaseClasses =
  'min-h-11 w-full rounded-control border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-colors focus:border-foreground focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground';

export const EditorialImage = ({
  src,
  alt,
  fallbackTitle,
  className = '',
  imgClassName = '',
  priority = false,
}: {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-background via-accent/35 to-background p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-display text-lg text-foreground">{fallbackTitle}</span>
        <span className="mt-1 text-xs text-muted">KOVA Atelier Archive</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-accent/25 ${className}`}>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-background via-accent/35 to-background"
        />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition-all duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected display error occurred.',
    };
  }

  handleReload = () => {
    this.setState({ hasError: false, message: '' });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-background p-6">
          <div
            role="alert"
            className="max-w-md w-full border border-border bg-surface p-8 text-center"
          >
            <h1 className="font-display text-2xl text-foreground">
              Unable to render this view
            </h1>
            <p className="mt-2 text-sm text-muted">{this.state.message}</p>
            <div className="mt-6">
              <Button onClick={this.handleReload}>Reload Storefront</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
