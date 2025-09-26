


type props = {
    title: string; 
    children: React.ReactNode 
}

export const Section = ({ title, children }: props) => {
    return (
      <div className="section">
        <div className="section-header">{title}</div>
        <div className="section-content">{children}</div>
      </div>
    );
  }