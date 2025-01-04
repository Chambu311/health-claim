"use client"

export default function LoadingDialog() {
    return (
        <>
            <div className="overlay">
                <div className="modal">
                    <div className="spinner" />
                    <h3>Processing your request...</h3>
                    <p>This may take a few moments</p>
                </div>
            </div>

            <style jsx>{`
                .overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 50;
                    display: grid;
                    place-content: center;
                    background: transparent;
                    backdrop-filter: blur(10px);
                }
                .modal {
                    width: 300px;
                    background: rgb(31 41 55);
                    padding: 2rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .spinner {
                    height: 4rem;
                    width: 4rem;
                    border-radius: 50%;
                    border: 4px solid transparent;
                    border-top-color: rgb(16 185 129);
                    border-bottom-color: rgb(16 185 129);
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }
                h3 {
                    color: rgb(229 231 235);
                    font-size: 1.125rem;
                    line-height: 1.75rem;
                }
                p {
                    color: rgb(156 163 175);
                    font-size: 0.875rem;
                    line-height: 1.25rem;
                    margin-top: 0.5rem;
                }
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </>
    );
}