import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white p-8 text-center">
          <p className="font-alverata text-xl font-semibold text-red-700">Algo salió mal</p>
          <pre className="max-w-lg overflow-auto rounded bg-red-50 p-4 text-left text-xs text-red-800">
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button
            type="button"
            className="button-primary"
            onClick={() => {
              this.setState({ error: null })
              window.location.href = '/login'
            }}
          >
            Volver al inicio
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
