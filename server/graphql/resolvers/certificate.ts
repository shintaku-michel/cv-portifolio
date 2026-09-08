import type { CreateCertificateInput, UpdateCertificateInput } from '../../services/certificate.service'
import { CertificateService } from '../../services/certificate.service'
import { assertAdmin } from '../../utils/authorize'
import type { GraphQLContext } from '../context'

export const certificateResolvers = {
  Query: {
    certificates: () => CertificateService.getAll(),

    certificateById: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return CertificateService.getById(id)
    }
  },

  Mutation: {
    createCertificate: (_parent: unknown, { input }: { input: CreateCertificateInput }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return CertificateService.create(input)
    },

    updateCertificate: (_parent: unknown, { id, input }: { id: string, input: UpdateCertificateInput }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return CertificateService.update(id, input)
    },

    deleteCertificate: (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      assertAdmin(context.user)
      return CertificateService.delete(id)
    }
  }
}
