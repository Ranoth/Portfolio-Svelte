// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Google reCAPTCHA
	interface Window {
		grecaptcha: {
			ready: (callback: () => void) => void;
			execute: (siteKey: string, options: { action: string }) => Promise<string>;
			render: (container: string | HTMLElement, parameters: {
				sitekey: string;
				theme?: 'light' | 'dark';
				size?: 'compact' | 'normal';
				callback?: (response: string) => void;
				'expired-callback'?: () => void;
				'error-callback'?: () => void;
			}) => number;
			reset: (widgetId?: number) => void;
			getResponse: (widgetId?: number) => string;
		};
	}

	// Also add it to globalThis for better compatibility
	var grecaptcha: {
		ready: (callback: () => void) => void;
		execute: (siteKey: string, options: { action: string }) => Promise<string>;
		render: (container: string | HTMLElement, parameters: any) => number;
		reset: (widgetId?: number) => void;
		getResponse: (widgetId?: number) => string;
	};
}

export {};
