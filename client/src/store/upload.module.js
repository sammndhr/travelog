import { createErrorMessage } from '@/utils'
import { geoJsonToImages } from '@/utils/'
import axios from 'axios'

const state = {
  geoJson: {
    type: 'FeatureCollection',
    features: []
  },
  filteredGeoJson: {
    type: 'FeatureCollection',
    features: []
  },
  filteredImages: { images: [], urls: [] },
  status: {},
  currMappedImages: { images: [], urls: [] },
  currUnmappedImages: { images: [], urls: [] },
  selectionCount: 0,
  mapped: true,
  warning: null,
  isEdit: false
}

const mutations = {
  UPLOAD_REQUEST(state) {
    state.status = { uploading: true }
  },

  UPLOAD_SUCCESS(state) {
    state.status = { uploaded: true }
  },

  UPLOAD_FAILURE(state) {
    state.status = {}
    state.geoJson.features = []
  },
  DELETE_REQUEST(state) {
    state.status = { deleting: true }
  },

  DELETE_SUCCESS(state, geoJson) {
    state.status = { deleted: true }
    state.geoJson = geoJson
  },

  DELETE_FAILURE(state) {
    state.status = {}
  },

  GET_GEOSON_REQUEST(state) {
    state.status = { fetching: true }
  },

  GET_GEOSON_SUCCESS(state, geoJson) {
    state.status = { fetched: true }
    state.geoJson = geoJson
  },

  GET_GEOSON_FAILURE(state) {
    state.status = {}
    state.geoJson.features = []
  },

  UPDATE_FILTERED_GEOJSON(state, filteredGeoJson) {
    state.filteredGeoJson = filteredGeoJson
  },

  UPDATE_FILTERED_IMAGES(state, filteredImages) {
    state.filteredImages = filteredImages
  },

  UPDATE_CURR_MAPPED_IMAGES(state, currMappedImages) {
    state.currMappedImages = currMappedImages
  },

  UPDATE_CURR_UNMAPPED_IMAGES(state, currUnmappedImages) {
    state.currUnmappedImages = currUnmappedImages
  },

  INCREMENT_SELECTION_COUNT(state) {
    state.selectionCount++
  },

  DECREMENT_SELECTION_COUNT(state) {
    state.selectionCount--
  },

  RESET_SELECTION_COUNT(state) {
    state.selectionCount = 0
  },

  UPDATE_SELECTION_COUNT(state, selectionCount) {
    state.selectionCount = selectionCount
  },

  UPDATE_MAPPED(state, mapped) {
    state.mapped = mapped
  },
  UPDATE_WARNING_MESSAGE(state, message) {
    state.warning = message
  },
  UPDATE_IS_EDIT(state, isEdit) {
    state.isEdit = isEdit
  }
}

const getters = {
  mappedGeoJson: state => {
    const features = state.geoJson.features,
      geoJson = JSON.parse(JSON.stringify(state.geoJson))

    const featuresWithLocation = features.filter(feature => {
      return feature.geometry.coordinates.length > 0
    })

    geoJson.features = featuresWithLocation
    return geoJson
  },

  unmappedGeoJson: state => {
    const features = state.geoJson.features,
      geoJson = JSON.parse(JSON.stringify(state.geoJson))

    const unmappedFeatures = features.filter(feature => {
      return feature.geometry.coordinates.length < 1
    })

    geoJson.features = unmappedFeatures
    return geoJson
  },

  mappedImages: (state, getters) => {
    const geoJson = getters.mappedGeoJson
    const images = geoJsonToImages(geoJson)
    return images
  },

  unmappedImages: (state, getters) => {
    const geoJson = getters.unmappedGeoJson
    const images = geoJsonToImages(geoJson)
    return images
  },

  unmappedCount: (state, getters) => {
    return getters.unmappedImages.images.length
  },

  currImages: state => {
    return state.mapped ? state.currMappedImages : state.currUnmappedImages
  },

  currImagesCount: state => {
    return state.mapped
      ? state.currMappedImages.images.length
      : state.currUnmappedImages.images.length
  }
}

const actions = {
  uploadRequest({ commit }) {
    commit('UPLOAD_REQUEST')
  },

  async uploadAll({ dispatch, commit }, images) {
    dispatch('uploadRequest')

    const promises = []
    for (let image of images) {
      const { key, file } = image,
        imageData = [],
        formData = new FormData(),
        extension = file.type.split('/').pop(),
        newName = `${key}.${extension}`
      imageData.push({ key, extension, name: newName })
      formData.append('photos', file, newName)
      formData.append('allImageData', JSON.stringify(imageData))
      const uploading = dispatch('upload', formData)
      promises.push(uploading)
    }

    Promise.all(promises).then(() => {
      dispatch('getGeojson')
      commit('UPLOAD_SUCCESS')
    })
  },

  async upload({ dispatch, commit, rootState }, formData) {
    const options = {
      method: 'POST',
      headers: { 'x-access-token': rootState.account.user.token },
      data: formData,
      url: `${process.env.VUE_APP_BACKEND_URL}/uploads`
    }
    try {
      const res = await axios(options)
      const message = `Some images uploaded without location!`
      if (res.data.feature.geometry.coordinates.length < 2)
        dispatch('updateWarning', message)
      dispatch('getGeojson')
      return res
    } catch (error) {
      console.log(error)
      const errorMessage = createErrorMessage(error)
      commit('UPLOAD_FAILURE')
      dispatch('alert/error', errorMessage, { root: true })
    }
  },

  async delete({ dispatch, commit, rootState }, images) {
    commit('DELETE_REQUEST')
    const options = {
      method: 'POST',
      headers: { 'x-access-token': rootState.account.user.token },
      data: images,
      url: `${process.env.VUE_APP_BACKEND_URL}/uploads/deletes`
    }
    try {
      const results = await axios(options)
      if (results.status >= 200) {
        const geoJson = results.data.geoJson
        commit('DELETE_SUCCESS', geoJson)
        dispatch('getGeojson')
        setTimeout(() => {
          dispatch('alert/success', 'Delete successful', { root: true })
        })
      }
    } catch (error) {
      console.log(error)
      const errorMessage = createErrorMessage(error)
      commit('DELETE_FAILURE')
      dispatch('alert/error', errorMessage, { root: true })
    }
  },

  async getGeojson({ dispatch, commit, state, getters, rootState }) {
    commit('GET_GEOSON_REQUEST')
    const options = {
      method: 'GET',
      headers: { 'x-access-token': rootState.account.user.token },
      url: `${process.env.VUE_APP_BACKEND_URL}/uploads/log`
    }
    try {
      const results = await axios(options)
      if (results.status >= 200) {
        const geoJson = results.data.geoJson
        commit('GET_GEOSON_SUCCESS', geoJson)
        setTimeout(() => {
          dispatch('alert/success', 'Fetch successful', { root: true })
          state.mapped
            ? dispatch('updateCurrImages', getters.mappedImages)
            : dispatch('updateCurrImages', getters.unmappedImages)
        })
      }
    } catch (error) {
      console.log(error)
      const errorMessage = createErrorMessage(error)
      commit('GET_GEOSON_FAILURE')
      dispatch('alert/error', errorMessage, { root: true })
    }
  },

  updateFilteredGeoJson({ dispatch, commit }, filteredGeoJson) {
    const filteredImages = geoJsonToImages(filteredGeoJson)
    commit('UPDATE_FILTERED_GEOJSON', filteredGeoJson)
    dispatch('updateFilteredImages', filteredImages)
  },

  updateFilteredImages({ commit, dispatch }, filteredImages) {
    commit('UPDATE_FILTERED_IMAGES', filteredImages)
    dispatch('unselectAllItems')
  },

  updateCurrImages({ commit, state }, currImages) {
    // console.log(state.mapped)
    state.mapped
      ? commit('UPDATE_CURR_MAPPED_IMAGES', currImages)
      : commit('UPDATE_CURR_UNMAPPED_IMAGES', currImages)

    // commit('UPDATE_CURR_IMAGES', currImages)
  },

  updateSelectionCount({ commit }, { type, count }) {
    const mutationTypes = {
      increment: 'INCREMENT_SELECTION_COUNT',
      decrement: 'DECREMENT_SELECTION_COUNT',
      reset: 'RESET_SELECTION_COUNT'
    }
    if (type === 'update') commit('UPDATE_SELECTION_COUNT', count)
    else {
      commit(mutationTypes[type])
    }
  },

  updateMapped({ commit, state, getters, dispatch }, mapped) {
    commit('UPDATE_MAPPED', mapped)
    const images = state.mapped ? getters.mappedImages : getters.unmappedImages

    dispatch('updateCurrImages', images)
  },

  updateWarning({ commit }, message) {
    commit('UPDATE_WARNING_MESSAGE', message)
  },

  unselectAllItems({ dispatch, getters }) {
    const images = getters.currImages
    const currImages = JSON.parse(JSON.stringify(images))
    for (const image of currImages.images) {
      image.selected = false
    }
    dispatch('updateCurrImages', currImages)
    dispatch('updateSelectionCount', { type: 'reset' })
  },

  updateIsEdit({ commit }, isEdit) {
    commit('UPDATE_IS_EDIT', isEdit)
  }
}

export const data = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
