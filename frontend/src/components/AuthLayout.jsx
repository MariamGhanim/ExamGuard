import examGuardMark from "../assets/examguard-mark.svg";
import "../pages/LoginPage.css";

export default function AuthLayout({ titleId, subtitle, children, footnote }) {
  return (
    <main className="login-page">
      <section className="login-page__card" aria-labelledby={titleId}>
        <header className="login-page__brand">
          <img
            className="login-page__mark"
            src={examGuardMark}
            alt=""
            width="48"
            height="48"
          />
          <h1 id={titleId} className="login-page__title">
            ExamGuard
          </h1>
          {subtitle ? <p className="login-page__subtitle">{subtitle}</p> : null}
        </header>
        {children}
        {footnote ? <p className="login-page__footnote">{footnote}</p> : null}
      </section>
    </main>
  );
}
