import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic title and description from query params
        const title = searchParams.get('title') || 'Nyembotech';
        const description = searchParams.get('description') || 'Architects of the Digital Future.';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#050a10', // Dark background
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #ffffff 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ffffff 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        color: 'white',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Subtle Blue Glow */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                        }}
                    />

                    {/* Logo / Brand Name */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, zIndex: 10 }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#38bdf8', /* Nyembo Sky */
                            borderRadius: '50%',
                            marginRight: 15,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#000'
                        }}>
                            N
                        </div>
                        <span style={{ fontSize: 32, fontWeight: 700, color: '#f6e30f' /* Nyembo Gold */ }}>Nyembotech</span>
                    </div>

                    {/* Main Title */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            maxWidth: '80%',
                            zIndex: 10
                        }}
                    >
                        <h1
                            style={{
                                fontSize: 64,
                                fontWeight: 900,
                                background: 'linear-gradient(to bottom right, #f6e30f, #38bdf8)',
                                backgroundClip: 'text',
                                color: 'transparent',
                                margin: '0 0 20px 0',
                                lineHeight: 1.1,
                                textShadow: '0 4px 10px rgba(0,0,0,0.5)'
                            }}
                        >
                            {title}
                        </h1>
                        <p
                            style={{
                                fontSize: 28,
                                color: '#94a3b8',
                                margin: 0,
                                lineHeight: 1.4,
                                fontWeight: 500
                            }}
                        >
                            {description}
                        </p>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        console.error(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
