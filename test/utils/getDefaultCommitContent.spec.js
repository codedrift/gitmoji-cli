import fs from 'fs'
import getDefaultCommitContent from '../../src/utils/getDefaultCommitContent'

describe('getDefaultCommitContent', () => {
  it('should retrieve title and message when file exists', () => {
    process.argv[3] = 'commit'
    fs.readFileSync.mockReturnValueOnce({
      toString: () => 'commit title\n\ncommit message'
    })

    const { title, message } = getDefaultCommitContent()

    expect(title).toBe('commit title')
    expect(message).toBe('commit message')
  })

  it('should retrieve empty title and message when file does not exist', () => {
    const { title, message } = getDefaultCommitContent()

    expect(title).toBe('')
    expect(message).toBe('')
  })

  it('should retrieve empty title and message when file does not exist', () => {
    process.argv[3] = 'commit'
    fs.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT')
    })

    const { title, message } = getDefaultCommitContent()

    expect(title).toBe('')
    expect(message).toBe('')
  })
})
