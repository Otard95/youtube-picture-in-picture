(() => {

  const embedHtml = (id) => `
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/${id}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `

  const newVideoHtml = `
    <div class="new-container">
      <div class="new-form">
        <input type="url" name="video" id="video" placeholder="www.youtube.com/watch?v=xWgNOCqyjJg">
        <button disabled>Watch</button>
      </div>
    </div>
  `

  const state = {
    newFormOpen: false,
  }

  /**
   * @param {string} html 
   */
  const DOM = (html) => {
    const div = document.createElement('div')
    div.innerHTML = html.trim()
    return div.childNodes
  }

  /**
   * @param {string} url 
   */
  const getVideoId = (url) => {
    const match = url.match(/https?:\/\/www\.youtube\.com\/watch\/?\?(?:[\w\[\]]+=.*)*(v=\w+)/)
    if (!match) return null
    const param = match[1]
    if (typeof param === 'string') {
      return param.substring(2)
    }
    return null
  }

  const initNewVideoDom = (newVideoDom) => {
    if (!newVideoDom) return;
    const button = newVideoDom.querySelector('button')
    const input = newVideoDom.querySelector('input')
    input.addEventListener('change', () => {
      button.disabled = (getVideoId(input.value) === null)
    })
    input.addEventListener('keyup', () => {
      button.disabled = (getVideoId(input.value) === null)
    })
    button.addEventListener('click', () => {
      const id = getVideoId(input.value)
      if (id) {
        const iFrame = document.querySelector('iframe')
        const newIFrame = DOM(embedHtml(id))
        document.body.append(...newIFrame)
        iFrame && iFrame.remove()
        toggleNewVideoForm()
      }
    })
  }

  const toggleNewVideoForm = () => {
    state.newFormOpen = !state.newFormOpen

    if (state.newFormOpen) {
      const newVideoDom = DOM(newVideoHtml)[0]
      initNewVideoDom(newVideoDom)
      document.body.append(newVideoDom)
    } else {
      document.querySelector('.new-container').remove()
    }

    const newVideoBtn = document.querySelector('#new-video')
    newVideoBtn.innerHTML = state.newFormOpen ? '-' : '+'
    state.newFormOpen
      ? newVideoBtn.classList.add('close')
      : newVideoBtn.classList.remove('close')
  }

  const init = () => {

    document.querySelector('#close-window').addEventListener('click', () => {
      console.log(require('electron').ipcRenderer.send('exit'))
    })
    
    document.querySelector('#new-video').addEventListener('click', () => {
      toggleNewVideoForm()
    })

    toggleNewVideoForm()

  }

  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init();
    }
  };

})()