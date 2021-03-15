import React from 'react';
import ReactDOM from 'react-dom';

import "bootstrap/dist/css/bootstrap.min.css";
// import "font-awesome/css/font-awesome.min.css";
import "./index.scss";

import marked from "marked";

import { placeholderMarkdown } from "./placeholderMarkdown";


const renderer = {
    link(href, title, text) {
        return `
            <a href=${href} title=${title} target="_blank">${text}</a>
        `
    }
}

marked.use({ renderer });

const Editor = ({ markdown, setMarkdown }) => {

    const handleChange = e => {
        setMarkdown(e.target.value)
    }

    const handleTab = e => {
        if (e.code === "Tab") {
            e.preventDefault();
            const selectionStart = e.target.selectionStart;
            const selectionEnd = e.target.selectionEnd;
            const indentedString = e.target.value.substring(0, selectionStart) + "\t" + e.target.value.substring(selectionEnd);
            setMarkdown(indentedString);
        }
    }

    return (
        <textarea
            id="editor"
            className="form-control"
            value={markdown}
            onChange={handleChange}
            onKeyDown={handleTab} />
    )
}

const Preview = ({ markdown }) => {
    return (
        <div
            id="preview"
            className="preview"
            dangerouslySetInnerHTML={{ __html: marked(markdown, { breaks: true, gfm: true }) }}
        />
    )
}


const App = () => {
    const [markdown, setMarkdown] = React.useState(placeholderMarkdown);
    const [mdLink, setMdLink] = React.useState('');
    const [htmlLink, setHtmlLink] = React.useState('');

    const makeMd = (text) => {
        const data = new Blob([text], { type: 'text/markdown' });

        if (mdLink !== '') window.URL.revokeObjectURL(mdLink);

        setMdLink(window.URL.createObjectURL(data));
    }

    const makeHtml = (text) => {
        const toHtml = marked(text, { breaks: true, gfm: true });
        const data = new Blob([toHtml], { type: 'text/html' });

        if (htmlLink !== '') window.URL.revokeObjectURL(htmlLink);

        setHtmlLink(window.URL.createObjectURL(data));
    }

    React.useEffect(() => {
        makeMd(markdown);
        makeHtml(markdown);
    }, [markdown]); // eslint-disable-line

    return (
        <div className="container-fluid">
            <div className="row h-auto justify-content-between align-items-center">
                <div>
                    <h1 className="m-2">Markdown Previewer</h1>
                </div>
                <div>
                    <a className="btn btn-outline-dark" href={mdLink} download="asMarkdown.md"><i class="fab fa-markdown fa-lg"></i> Save as .md</a>
                    <a className="btn btn-outline-warning m-2" href={htmlLink} download="asHtml.html"><i className="fab fa-html5 fa-lg"></i> Save as .html</a>
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <Editor markdown={markdown} setMarkdown={setMarkdown} />
                </div>
                <div className="col-8">
                    <Preview markdown={markdown} />
                </div>
            </div>
        </div>
    );
}



ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
