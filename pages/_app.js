import Head from 'next/head';

import '../styles/style.scss';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Anon Q&A | Nacho Caiafa</title>
				<meta
					name="description"
					content="Preguntas y respuestas anonimas a Nacho Caiafa"
				/>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
