import { TechnologyService } from '../../services/technology.service'

export const technologyResolvers = {
  Query: {
    technologies: () => TechnologyService.getAll()
  }
}
