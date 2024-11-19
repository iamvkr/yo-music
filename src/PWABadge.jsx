import { useRegisterSW } from 'virtual:pwa-register/react'

function PWABadge() {
    // periodic sync is disabled, change the value to enable it, the period is in milliseconds
    // You can remove onRegisteredSW callback and registerPeriodicSync function
    const period = 0

    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl, r) {
            if (period <= 0) return
            if (r?.active?.state === 'activated') {
                registerPeriodicSync(period, swUrl, r)
            }
            else if (r?.installing) {
                r.installing.addEventListener('statechange', (e) => {
                    /** @type {ServiceWorker} */
                    const sw = e.target
                    if (sw.state === 'activated')
                        registerPeriodicSync(period, swUrl, r)
                })
            }
        },
    })

    function close() {
        setNeedRefresh(false)
    }

    return ((needRefresh) &&
        <div className="fixed top-0 left-0 bg-zinc-800/70  h-screen w-full px-2 pt-4" role="alert" aria-labelledby="toast-message">
            <div className="bg-white text-zinc-800 p-2 border border-black rounded-xl">
                <div className="PWABadge-message mb-4">
                    <span className='font-bold text-xl'>New content available!</span><br />
                    <span className='text-md'>Click on reload button to update.</span>
                </div>
                <div className="flex justify-end gap-x-4">
                    <button className="btn btn-success text-white" onClick={() => { updateServiceWorker(true) }}>Reload</button>
                    <button className="btn btn-success text-white" onClick={() => { close() }}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default PWABadge

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 * @param period {number}
 * @param swUrl {string}
 * @param r {ServiceWorkerRegistration}
 */
function registerPeriodicSync(period, swUrl, r) {
    if (period <= 0) return

    setInterval(async () => {
        if ('onLine' in navigator && !navigator.onLine)
            return

        const resp = await fetch(swUrl, {
            cache: 'no-store',
            headers: {
                'cache': 'no-store',
                'cache-control': 'no-cache',
            },
        })

        if (resp?.status === 200)
            await r.update()
    }, period)
}
